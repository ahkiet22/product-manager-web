const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Loc sp
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    if (req.query.status == "bin") {
      find.deleted = true;
    } else {
      find.status = req.query.status;
    }
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.keyword) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    statusBin: req.query.status,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhập trạng thái thành công");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(", ");
  const type = req.body.type;

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "active" } }
      );
      req.flash(
        "success",
        `cập nhập trang thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "inactive" } }
      );
      req.flash(
        "success",
        `cập nhập trang thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { deleted: true, deletedAt: new Date() } }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
        req.flash(
          "success",
          `Đã đổi vị trí thành công ${ids.length} sản phẩm!`
        );
      }
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  if (req.body.typeAction === "bin") {
    await Product.deleteOne({ _id: id }); // Xóa cứng
  } else {
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    ); // Xóa mềm
  }
  req.flash("success", `Đã xóa thành công sản phẩm!`);
  res.redirect("back");
};

// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { deleted: false });

  req.flash("success", "Khôi phục thành công");
  res.redirect("back");
};
