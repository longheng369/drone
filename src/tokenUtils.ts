// tokenUtils.ts

// Define an interface for the token structure
interface Token {
   role: string;
   pairingPoint?: string;
}

// Function to create a token
export const createToken = (role: string, pairingPoint?: string): string => {
   const token: Token = {
       role,
       pairingPoint,
   };
   return btoa(JSON.stringify(token)); // Base64 encode for simplicity
};

// Function to decode a token
export const decodeToken = (token: string): Token => {
   return JSON.parse(atob(token)); // Decode Base64
};
