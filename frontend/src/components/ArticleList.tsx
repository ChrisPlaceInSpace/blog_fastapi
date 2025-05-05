import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Box,
} from '@mui/material';
import { api, Article } from '../services/api';

const ArticleList = () => {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: api.getArticles,
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading articles...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">Error loading articles</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Articles
      </Typography>
      <Grid container spacing={3}>
        {articles?.map((article) => (
          <Grid item xs={12} key={article._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {article.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {article.content}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {article.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={`/articles/${article._id}`}
                  size="small"
                >
                  Read More
                </Button>
                <Button
                  component={RouterLink}
                  to={`/edit/${article._id}`}
                  size="small"
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ArticleList; 