

//const service = process.env.BACKEND_URL;
const baseUri = 'http://node-service:3500/auth';
//IMPORTANT: BROWSER CAN NOT RECOGNIZE THIS ROUTE AS NODE SERVICE IS ONLY INSIDE THE CLUSTER. I WOULD
// HAVE TO MAKE NODE SERVER ACCESSIBLE FROM LOCALHOST AND THEN 
//baseUri = 'http://localhost:nodeport/auth'
//BUT AS THIS IS NOT REALISTIC FOR PRODUCTION, WE WILL HAVE TO APPLY AN INGRESS CONTROLLER

//cambiar api por la url de verdad, ya que api/ no es traducido por el nginx

export const registerUser = async (username, password) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};
