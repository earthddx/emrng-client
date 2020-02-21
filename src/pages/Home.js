import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  //from useQuery hook
  let posts = "";
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  if (data) {
    posts = { data: data.getPosts };
  }
  //posts are stored in getPosts obj

  return (
    <Grid columns={4}>
      <Grid.Row className="page-title">
      </Grid.Row>
      <Grid.Row>
        {user && ( //if a user logged in
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          //if the data !=null
          <Transition.Group>
            {posts.data &&
              posts.data.map(post => (
                //iterate through all of the posts and display them
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
