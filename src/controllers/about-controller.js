export const aboutController = {
    index: {
      handler: function (request, h) {
        const viewData = {
          title: "About ourHospital",
        };
        return h.view("about-view", viewData);
      },
    },
  };
  