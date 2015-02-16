/**
 * @file
 * Defines 'UserData', 'OrgData', 'Contributions', and 'Repos' collections.
 */
/* globals UserData:true, OrgData:true, Contributions:true, Repos:true, Mongo */

// Declare userData collection.
UserData = new Mongo.Collection('userData');

// Declare orgData collection.
OrgData = new Mongo.Collection('orgData');

// Declare contributions collection.
Contributions = new Mongo.Collection('contributions');

// Declare repos collection.
Repos = new Mongo.Collection('repos');
