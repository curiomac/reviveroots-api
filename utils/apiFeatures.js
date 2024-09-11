class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    let keyword = this.queryStr.keyword
      ? {
          productName: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const excludedFields = ["keyword", "limit", "page"];
    let queryObj = { ...this.queryStr };

    excludedFields.forEach((el) => delete queryObj[el]);

    for (const [key, value] of Object.entries(queryObj)) {
      if (key === "product_status") {
        const formattedArray = value.split(",");
        queryObj["productStatus"] = { $in: formattedArray };
      } else if (key === "product_category") {
        const formattedArray = value.split(",");
        queryObj["productCategory"] = { $in: formattedArray };
      }
    }
    this.query.find(queryObj);
    return this;
  }
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
