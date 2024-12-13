import { jwtDecode } from "jwt-decode";

export function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);

    if (!decoded || !decoded.authorities) {
      throw new Error("Token inválido o mal formado");
    }

    // Verificar si authorities es un string o ya es un array
    let authorities = decoded.authorities;

    // Si authorities es una cadena JSON, lo parseamos
    if (typeof authorities === "string") {
      try {
        authorities = JSON.parse(authorities);
      } catch (error) {
        throw new Error("Error al parsear 'authorities'");
      }
    }

    // Verificar si authorities ahora es un array
    if (Array.isArray(authorities)) {
      return {
        roles: authorities.map((auth) => auth.authority),
      };
    } else {
      throw new Error("authorities no es un array");
    }
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    throw new Error("Error al procesar el token");
  }
}
