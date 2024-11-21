import Product from "../model/product";

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
  const perPage = parseInt(req.query.per_page) || 10; // Số lượng sản phẩm trên mỗi trang, mặc định là 10

  try {
    // Lấy tổng số sản phẩm
    const total = await Product.countDocuments();

    // Tính tổng số trang
    const totalPages = Math.ceil(total / perPage);

    // Lấy sản phẩm của trang hiện tại
    const data = await Product.find()
      .skip((page - 1) * perPage) // Bỏ qua các sản phẩm trước đó
      .limit(perPage); // Giới hạn số lượng sản phẩm trả về

    res.status(200).json({
      total,
      total_page: totalPages,
      page,
      per_page: perPage,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsBestSelling = async (req, res) => {
  try {
    const data = await Product.find().sort({ stock: "desc" }).limit(4);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsLatest = async (req, res) => {
  try {
    const data = await Product.find().limit(4);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id });
    if (data.length < 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const data = await Product(req.body).save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    if (data.length < 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const data = await Product.findOneAndDelete({ _id: req.params.id });
    if (data.length < 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
