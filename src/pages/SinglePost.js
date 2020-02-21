import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Grid,
  Card,
  Button,
  Icon,
  Label,
  Form,
  Popup
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";

function SinglePost(props) {
  const postId = props.match.params.postId; //url parameteres
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error.</p>;

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;
  if (!data.getPost) {
    postMarkup = <p>Loading...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = data.getPost;

    postMarkup = (
      <Grid>
        <div className="ui grid row">
          <Card>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likeCount, likes }} />
              <Popup
                content="Comment on post"
                inverted
                trigger={
                  <Button
                    as="div"
                    labelPosition="right"
                    onCLick={() => console.log("Comment")}
                  >
                    <Button basic color="grey">
                      <Icon name="comment" />
                    </Button>
                    <Label basic color="grey" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                }
              />
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <div className="ui fluid card">
              <Card.Content>{/*change here*/}
                <p>Post a comment</p>
                <Form>
                  <div className="ui action input fluid">
                    <input
                      type="text"
                      placeholder=""
                      name="comment"
                      value={comment}
                      onChange={event => setComment(event.target.value)}
                      ref={commentInputRef}
                    />
                    <button
                      type="submit"
                      className="ui button primary"
                      disabled={comment.trim() === ""}
                      onClick={submitComment}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </div>
          )}
          {comments.map(comment => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </div>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
