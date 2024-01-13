# User story for PeerPulse

## Sign up

1. User signs up with .edu email
2. Verifies if the email is valid and is a .edu email and is not already registered
3. User verifies the email by clicking on the link sent to their email
4. User is assigned it's college's channel if exists else new college channel is created

## Sign in

1. User signs in with their .edu email
2. Verifies if the credential is valid and user is verified
3. User is logged in using JWT

## Logged In User

1. User can access their profile
2. User can access their college's channel
3. User can access the public channel
4. User can create post in their college's channel
5. User can create post in the public channel
6. User can comment on any post
7. User can upvote/downvote any post
8. User can review their college

## Guest User

1. Guest user can access the public channel

## Post

1. Post can be a text, image or a poll
2. Post can be upvoted/downvoted by logged in user
3. Post can be commented by logged in user
4. Post can be reported by logged in user
5. Post can be deleted by the user who created it
6. Post can be deleted by the admin
7. Post in the public channel can be viewed by everyone
8. Post in the college channel can be viewed only by the students of that college

### Text

1. Text should be between 100 to 500 characters
2. Text can include links and images

### Poll

1. Poll consists of a question and 2 or more options

## Comment

1. Comment can be deleted by the user who created it
2. Comment can be deleted by the admin
3. Comment can be reported by logged in user

## Review

1. Review consists of a rating and a comment
2. Reviews are anonymous and can be viewed by everyone
