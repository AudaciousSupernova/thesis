# KarmaExchange
> A social stock market to manage your online presence

## Team

  - __Product Owner__: Neeraj Kohirkar
  - __Scrum Master__: Kyle Morehead
  - __Development Team Members__: Ranjit Rao, Kartik Vempati

## Description
KarmaExchange is a tool to measure your social presence online. It rates your current online presence based on the amount of
attention your recent posts receive and your recent activity. In addition, your network can be motivated to assist
you in your self improvement goals by investing virtual currency in your success. The goal is to simulate a social stock market
that aims to improve the social online presences of its users.

## Requirements

- Node
- Ionic
- MySQL
- Gulp
- Karma
- Socket.io

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
npm install -g karma
npm install -g gulp
```

### Roadmap

View the project roadmap [here](https://github.com/AudaciousSupernova/thesis/issues)

## Routing
Server Side API Routes | Function
----------------------|---------
/api/loggedin| GET request to determine whether not a user has been authenticated with Facebook
/api/logout | GET request which removes the token to log a user out. This does not log the user out of their Facebook Account
however.
/auth/facebook| GET request which will send the user through the Facebook authentication process
/auth/facebook/callback| GET request for the callback which will redirect the user either to the /#home route on a successful
authentication or the /#login route on a failed authentication



## Privacy Policy
Nova does not store any of its users data in its databases. Data (posts, likes, comments, photos, friends, connections) are
only used to calculate a user rating. Though we don’t share any of your data, unless it’s permitted by you, but in case of
legal action we will support official authorities as much as we can in investigation by providing information required. Nova
does not operate for profit and will not sell your information or use your information to advertise products to you. Nova does
require your information to log in, and thus will be storing a hash of your session in its server. This is how it communicates
to the browser that a user is logged in.
