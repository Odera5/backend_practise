const processLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/login");
    }

    res.redirect("/login?logout=success");
  });
};
export { processLogout };
