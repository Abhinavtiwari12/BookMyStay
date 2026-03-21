export const searchQuery = (keyword) => {
  return [
    {
      $match: {
        $or: [
          {
            hotelName: {
              $regex: keyword,
              $options: "i"
            }
          },
          {
            address: {
              $regex: keyword,
              $options: "i"
            }
          }
        ]
      }
    }
  ];
};
