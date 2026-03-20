export const searchQuery = (keyword) => {
  return [
    {
      $match: {
        $or: [
          {
            productName: {
              $regex: keyword,
              $options: "i"
            }
          },
          {
            category: {
              $regex: keyword,
              $options: "i"
            }
          }
        ]
      }
    }
  ];
};
