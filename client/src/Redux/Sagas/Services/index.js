
//If Record Doesn't Contain Any Image
export async function createRecord(collection, payload) {
  try {
    const token = localStorage.getItem("token")
    const headers = { "content-type": "application/json" }
    if (token) headers["authorization"] = token

    let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/${collection}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    })
    response = await response.json()
    return response.data
  } catch (error) {
    console.log(error)
  }
}

//If Record  Contain Any Image
//If Record Contains Any Image
export async function createMultipartRecord(collection, payload) {
  try {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) headers["authorization"] = token;

    let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/${collection}`, {
      method: "POST",
      headers,
      body: payload
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create record');
    }
    return data.data || data;
  } catch (error) {
    console.error('Error in createMultipartRecord:', error);
    throw error; // Re-throw to handle in the saga
  }
}

export async function getRecord(collection) {
  try {
    let url = `${import.meta.env.VITE_SITE_BACKEND_SERVER}/${collection}`

    // Build the correct URL for cart, wishlist, checkout
    if (collection === "cart" || collection === "wishlist" || collection === "checkout") {
      const userid = localStorage.getItem("userid")
      url = `${import.meta.env.VITE_SITE_BACKEND_SERVER}/${collection}/user/${userid}`
    }

    const token = localStorage.getItem("token")
    const headers = { "content-type": "application/json" }
    if (token) headers["authorization"] = token

    let response = await fetch(url, {
      method: "GET",
      headers
    })
    response = await response.json()
    return response.data
  } catch (error) {
    console.log(error)
    return []
  }
}

//If Record Doesn't Contain Any Image
export async function updateRecord(collection, payload) {
    try {
        const token = localStorage.getItem("token")
        const headers = { "content-type": "application/json" }
        if (token) headers["authorization"] = token

        let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/${collection}/${payload._id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload)
        })
        
        const data = await response.json()
        
        if (!response.ok) {
            console.error("Update failed:", data)
            throw new Error(data.reason || data.message || 'Update failed')
        }
        
        return data.data
    } catch (error) {
        console.error("Error in updateRecord:", error)
        throw error
    }
}

//If Record Contain Any Image
export async function updateMultipartRecord(url, formData) {
  const token = localStorage.getItem("token") || import.meta.env.VITE_SITE_PUBLIC_KEY

  const response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/${url}`, {
    method: "PUT",
    headers: { "authorization": token },
    body: formData
  })

  const data = await response.json()
  return data.data || data  // Backend returns { data: product }
}

export async function deleteRecord(collection, payload) {
  try {
    const token = localStorage.getItem("token")
    const headers = { "content-type": "application/json" }
    if (token) headers["authorization"] = token

    let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/${collection}/${payload._id}`, {
      method: "DELETE",
      headers
    })
    response = await response.json()
    return response.data
  } catch (error) {
    console.log(error)
  }
}