# Gestion des conférences — Angular

## Démarrer sous Windows / PowerShell

Le projet Angular est dans le sous-dossier qui contient `package.json` :

```powershell
cd "C:\Users\khaled\Downloads\4SSA5-main\4SSA5-main"
npm.cmd install
```

Utiliser `npm.cmd` évite l'erreur « npm.ps1 : l'exécution de scripts est désactivée » sans modifier la politique de sécurité de PowerShell. Ne pas ajouter de barre oblique à la fin de la commande.

Dans un premier terminal, démarrer l'API et laisser ce terminal ouvert :

```powershell
npm.cmd run api
```

Dans un deuxième terminal, placé dans le même dossier :

```powershell
npm.cmd start
```

Ouvrir http://localhost:4200/list. L'API est disponible sur http://localhost:3000/conferences.

## Fonctionnalités

- Liste : `getAll()`, chargement HTTP et affichage avec Signals.
- Détails : `getById(id)`, route `/details/:id`.
- Ajout : `addConferance(conf)`, route `/conferences/add`.
- Modification : `updateConferance(id, conf)` utilise PUT ; le formulaire de `/update/:id` est prérempli.
- Suppression : `deleteConferance(id)` utilise DELETE ; la carte disparaît après confirmation du serveur.
- Les erreurs HTTP s'affichent dans les composants. Une suppression échouée conserve la carte.
- Les formulaires vérifient les champs obligatoires, le prix non négatif et le nombre entier de places non négatif.
- Après ajout ou modification, retour à la liste et rechargement des données.

`provideHttpClient()` est configuré dans `app.config.ts`. Le service, les composants et `db.json` utilisent les mêmes champs : `title`, `description`, `location`, `date`, `price`, `nbPlaces`. Les dates sont au format `YYYY-MM-DD`. Les descriptions et les nombres de places dans la base sont des données d'exemple.

## Vérification

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
```

`json-server` enregistre les ajouts, modifications et suppressions dans `db.json`.
