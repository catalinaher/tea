// js/auth.js
(function () {
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error("Supabase not configured");
    return;
  }

  window.sb = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  function setNav(session) {
    const login = document.getElementById("navLogin");
    const profile = document.getElementById("navProfile");
    const logout = document.getElementById("navLogout");

    if (!login || !profile || !logout) return;

    if (session?.user) {
      login.style.display = "none";
      profile.style.display = "inline-block";
      logout.style.display = "inline-block";
    } else {
      login.style.display = "inline-block";
      profile.style.display = "none";
      logout.style.display = "none";
    }
  }

  async function handleLoginPage() {
    const loading = document.getElementById("authLoading");
    const forms = document.getElementById("authForms");
    const loggedIn = document.getElementById("authLoggedIn");

    if (!loading || !forms || !loggedIn) return;

    const { data } = await window.sb.auth.getSession();

    loading.style.display = "none";
    if (data.session?.user) {
      loggedIn.style.display = "block";
    } else {
      forms.style.display = "block";
    }
  }

  async function refreshNav() {
    const { data } = await window.sb.auth.getSession();
    setNav(data.session);
  }

  window.addEventListener("click", async (e) => {
    const btn = e.target.closest("#navLogout");
    if (!btn) return;
    e.preventDefault();
    await window.sb.auth.signOut();
    window.location.href = "./login.html";
  });

  refreshNav();
  handleLoginPage();

  window.sb.auth.onAuthStateChange((_event, session) => {
    setNav(session);
  });
})();
