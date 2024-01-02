-- DROP ALL EXISTING FUNCTION
-- USER
DROP FUNCTION IF EXISTS web.get_all_users;
DROP FUNCTION IF EXISTS web.get_one_user;
DROP FUNCTION IF EXISTS web.insert_user;
DROP FUNCTION IF EXISTS web.update_user;
DROP FUNCTION IF EXISTS web.delete_user;
-- FRIEND
DROP FUNCTION IF EXISTS web.get_user_all_friends;
DROP FUNCTION IF EXISTS web.get_user_one_friend;
DROP FUNCTION IF EXISTS web.insert_user_friend;
DROP FUNCTION IF EXISTS web.delete_user_friend;
-- CREW
DROP FUNCTION IF EXISTS web.get_user_all_crews;
DROP FUNCTION IF EXISTS web.get_user_one_crew;
DROP FUNCTION IF EXISTS web.insert_user_crew;
DROP FUNCTION IF EXISTS web.update_user_crew;
DROP FUNCTION IF EXISTS web.delete_user_crew;
-- EVENT
DROP FUNCTION IF EXISTS web.get_user_all_events;
DROP FUNCTION IF EXISTS web.get_user_one_event;
DROP FUNCTION IF EXISTS web.insert_user_event;
DROP FUNCTION IF EXISTS web.update_user_event;
DROP FUNCTION IF EXISTS web.delete_user_event;