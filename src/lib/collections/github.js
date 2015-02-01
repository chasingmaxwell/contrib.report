/**
 * @file
 * Defines 'UserData', 'Contributions', and 'Repos' collections.
 */
/* globals UserData:true, Contributions:true, Repos:true, Mongo */

// Declare userData collection.
UserData = new Mongo.Collection('userData');

// Declare contributions collection.
Contributions = new Mongo.Collection('contributions');

// Declare repos collection.
Repos = new Mongo.Collection('repos');
