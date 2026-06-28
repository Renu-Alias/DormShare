export const validateRegister = (req, res, next) => {
    const { name, collegeEmail, password, hostelBlock } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
        return res.status(400).json({ message: "Valid college email is required" });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!hostelBlock || !["A Block", "B Block", "C Block", "D Block"].includes(hostelBlock)) {
        return res.status(400).json({ message: "Valid hostel block is required" });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { collegeEmail, password } = req.body;

    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
        return res.status(400).json({ message: "Valid college email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    next();
};

export const validateItem = (req, res, next) => {
    const {
        itemName,
        category,
        description,
        condition,
        transactionType,
        price,
        location
    } = req.body;

    if (!itemName || typeof itemName !== "string" || itemName.trim().length < 2) {
        return res.status(400).json({ message: "Item name is required" });
    }

    const validCategories = ["Books", "Electronics", "Bedding", "Kitchen", "Other"];
    if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ message: "Valid category is required" });
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
        return res.status(400).json({ message: "Description must be at least 10 characters" });
    }

    if (!condition || !["Like New", "Gently Used", "Heavy Wear"].includes(condition)) {
        return res.status(400).json({ message: "Valid condition is required" });
    }

    if (!transactionType || !["Free to Borrow", "Available for Lease"].includes(transactionType)) {
        return res.status(400).json({ message: "Valid transaction type is required" });
    }

    if (transactionType === "Available for Lease") {
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ message: "Valid price is required for lease items" });
        }
        req.body.price = parsedPrice;
    } else {
        req.body.price = 0;
    }

    if (!location || typeof location !== "string" || location.trim().length < 2) {
        return res.status(400).json({ message: "Location is required" });
    }

    next();
};

export const validateLease = (req, res, next) => {
    const { expectedReturnDate } = req.body;

    if (!expectedReturnDate || isNaN(Date.parse(expectedReturnDate))) {
        return res.status(400).json({ message: "Valid expected return date is required" });
    }

    const returnDate = new Date(expectedReturnDate);
    if (returnDate <= new Date()) {
        return res.status(400).json({ message: "Return date must be in the future" });
    }

    next();
};

export const validateExtension = (req, res, next) => {
    const { extensionDays } = req.body;

    if (!extensionDays || isNaN(extensionDays) || Number(extensionDays) < 1) {
        return res.status(400).json({ message: "Valid extension days is required (min 1)" });
    }

    next();
};
