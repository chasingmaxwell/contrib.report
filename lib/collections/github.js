/**
 * @file
 * Defines 'UserData', 'Contributions', and 'Repos' collections.
 */
/* globals UserData Contributions Repos Mongo */

// Declare userData collection.
UserData = new Mongo.Collection('userData');

// Declare contributions collection.
Contributions = new Mongo.Collection('contributions');

// Declare repos collection.
Repos = new Mongo.Collection('repos');
