async function fetchApi(path, method = "GET", body = null) {
  try {
    if (
      (method === "PUT" && path !== "/login") ||
      (method === "POST" && path === "/photos/")
    ) {
      {
        console.log("ciaone");
        console.log(body);
        const resp = await fetch(import.meta.env.VITE_API_URL + path, {
          method: method,
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : null,
          },
          body: body,
        });
        if (!resp.ok) {
          alert("Errore durante l'invio dei dati: " + (await resp.text()));
        }
      }
    } else {
      const resp = await fetch(import.meta.env.VITE_API_URL + path, {
        method,
        headers: {
          "Content-Type": body instanceof FormData ? null : "application/json",
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : null,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (data.error === "TokenExpiredError" || data.error === "AuthError") {
          localStorage.removeItem("token");
          window.location = "/login";
        }

        throw new Error(data.msg ?? data[0].msg);
      }
      return data;
    }
  } catch (err) {
    console.log(err.message);
  }
}

export default fetchApi;
