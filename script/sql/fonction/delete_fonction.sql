-- DROP ALL EXISTING FUNCTION

DROP FUNCTION IF EXISTS web.get_all_users;
DROP FUNCTION IF EXISTS web.get_one_user;
DROP FUNCTION IF EXISTS web.insert_user;
DROP FUNCTION IF EXISTS web.update_user;
DROP FUNCTION IF EXISTS web.delete_user;
DROP FUNCTION IF EXISTS web.get_all_friends;
DROP FUNCTION IF EXISTS web.get_one_friend;
DROP FUNCTION IF EXISTS web.add_friend_to_user;
DROP FUNCTION IF EXISTS web.get_user_crews_with_users;
DROP FUNCTION IF EXISTS web.get_user_one_crew;
DROP FUNCTION IF EXISTS web.create_crew_for_users;
DROP FUNCTION IF EXISTS web.delete_crew_and_links;
DROP FUNCTION IF EXISTS web.get_user_events_with_invitations;
DROP FUNCTION IF EXISTS web.create_event_for_users;
DROP FUNCTION IF EXISTS web.edit_user_event;
/* ATTENTION */ DROP FUNCTION IF EXISTS web.edit_user_event_origin;
DROP FUNCTION IF EXISTS web.edit_user_event;