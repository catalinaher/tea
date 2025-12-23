// frontend/js/auth.js
(function () {
  if (!window.supabase) {
    console.error("Supabase CDN not loaded");
    return;
  }

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error("Missing SUPABASE config");
    return;
  }

  // Create client ONCE
  window.sb = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  /* =========================
     NAV AUTH UI
  ========================= */
  function setNavAuthUI(session) {
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

  async function refreshNav() {
    const { data } = await window.sb.auth.getSession();
    setNavAuthUI(data.session);
  }

  /* =========================
     LOGIN PAGE GATING (FIX)
  ========================= */
  async function handleLoginPage() {
    const loading = document.getElementById("authLoading");
    const forms = document.getElementById("authForms");
    const loggedIn = document.getElementById("authLoggedIn");

    // Not on login page
    if (!loading || !forms || !loggedIn) return;

    const { data } = await window.sb.auth.getSession();

    loading.style.display = "none";

    if (data.session?.user) {
      loggedIn.style.display = "block";
    } else {
      forms.style.display = "block";
    }
  }

  /* =========================
     LOGOUT
  ========================= */
  window.addEventListener("click", async (e) => {
    const btn = e.target.closest("#navLogout");
    if (!btn) return;

    e.preventDefault();
    await window.sb.auth.signOut();
    window.location.href = "./login.html";
  });

  /* =========================
     OPTIONAL PAGE PROTECTION
  ========================= */
  async function protectIfNeeded() {
    const requires = document.body?.dataset?.requiresAuth === "true";
    if (!requires) return;

    const { data } = await window.sb.auth.getSession();
    if (!data.session?.user) {
      window.location.href = "./login.html";
    }
  }

  /* =========================
     USERNAME HELPER
  ========================= */
  window.getCurrentUsername = async function () {
    const { data } = await window.sb.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;

    const { data: prof } = await window.sb
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    return prof?.username || user.email || "User";
  };

  /* =========================
     INIT (ORDER MATTERS)
  ========================= */
  protectIfNeeded();
  refreshNav();
  handleLoginPage();

  window.sb.auth.onAuthStateChange((_event, session) => {
    setNavAuthUI(session);
  });
})();
