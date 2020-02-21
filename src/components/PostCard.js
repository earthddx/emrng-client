import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Button, Popup } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

function PostCard(props) {
  const {
    body,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes
  } = props.post;

  const { user } = useContext(AuthContext);

  return (
    <Card>
      <Card.Content>
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <div className="extra content">
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button icon basic>
                <Icon name="comment" />
              </Button>
              <Label basic pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === username && <DeleteButton postId={id} />}
      </div>
    </Card>
  );
}

export default PostCard;
