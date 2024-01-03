const keytar = require("keytar");

// Dans cet exemple, le service peut être utilisé pour identifier votre application, et l'account peut être utilisé pour distinguer les utilisateurs.

// Fonction pour enregistrer le token dans le trousseau d'accès
async function saveTokenToKeychain(service, account, token) {
  try {
    await keytar.setPassword(service, account, token);
    console.log("Token enregistré avec succès dans le trousseau d'accès.");
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement du token dans le trousseau d'accès:",
      error.message
    );
  }
}

// Fonction pour récupérer le token depuis le trousseau d'accès
async function retrieveTokenFromKeychain(service, account) {
  try {
    const token = await keytar.getPassword(service, account);
    if (token !== null) {
      console.log("Token récupéré avec succès depuis le trousseau d'accès.");
      return token;
    } else {
      console.log("Aucun token trouvé dans le trousseau d'accès.");
      return null;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du token depuis le trousseau d'accès:",
      error.message
    );
    return null;
  }
}

// Fonction pour supprimer le token du trousseau d'accès
async function deleteTokenFromKeychain(service, account) {
  try {
    await keytar.deletePassword(service, account);
    console.log("Token supprimé avec succès du trousseau d'accès.");
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du token depuis le trousseau d'accès:",
      error.message
    );
  }
}

// Exemple d'utilisation
const service = "nomDeVotreApplication";
const account = "nomDeLUtilisateur";

// Enregistrez le token dans le trousseau d'accès
saveTokenToKeychain(service, account, "votreToken");

// Récupérez le token depuis le trousseau d'accès
retrieveTokenFromKeychain(service, account).then((retrievedToken) => {
  if (retrievedToken !== null) {
    console.log("Token récupéré avec succès :", retrievedToken);
  }
});

// Supprimez le token du trousseau d'accès si nécessaire
deleteTokenFromKeychain(service, account);
