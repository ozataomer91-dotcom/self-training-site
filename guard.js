// route guard: redirect to login if not authenticated
(function(){
  if (!window.$auth) { 
    console.warn("Auth not ready"); 
    return; 
  }
  window.$auth.onChanged((user)=>{
    const onDashboard = location.pathname.endsWith("dashboard.html");
    if (!user && onDashboard) {
      location.replace("./index.html");
    }
    if (user && !onDashboard) {
      // already logged in and trying to view login/signup
      // optional: redirect to dashboard
    }
  });
})();
