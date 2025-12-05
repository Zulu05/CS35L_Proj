
export async function checkPassword(username: string, password: string) {
  try {
    const res = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      console.error("Login failed with status:", res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.log("Error checking password:", err);
    return null;
  }
}