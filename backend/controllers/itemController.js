import Item from "../models/item.js";
import { protect } from "../middleware/auth.js";
import { validateItem } from "../middleware/validation.js";

export const createItem = async (req, res) => {
    try {
        let images = req.body.images || [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => `/uploads/${file.filename}`);
        }

        const itemData = {
            ...req.body,
            owner: req.user._id,
            images
        };

        const item = await Item.create(itemData);

        await item.populate("owner", "name collegeEmail hostelBlock");

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getItems = async (req, res) => {
    try {
        const {
            category,
            hostelBlock,
            transactionType,
            condition,
            search,
            page = 1,
            limit = 12
        } = req.query;

        const query = { isAvailable: true };

        if (category) query.category = category;
        if (hostelBlock) query.hostelBlock = hostelBlock;
        if (transactionType) query.transactionType = transactionType;
        if (condition) query.condition = condition;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const items = await Item.find(query)
            .populate("owner", "name collegeEmail hostelBlock")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Item.countDocuments(query);

        res.status(200).json({
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ owner: req.user._id })
            .populate("owner", "name collegeEmail hostelBlock")
            .sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate(
            "owner",
            "name collegeEmail hostelBlock roomNumber"
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }

        Object.assign(item, req.body);
        const updatedItem = await item.save();
        await updatedItem.populate("owner", "name collegeEmail hostelBlock");

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }

        await item.deleteOne();
        res.status(200).json({ message: "Item removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleAvailability = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }

        item.isAvailable = !item.isAvailable;
        await item.save();
        await item.populate("owner", "name collegeEmail hostelBlock");

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
