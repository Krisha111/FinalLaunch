import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // Optional but recommended
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust the base URL to your API
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts', // Adjust the endpoint to your API
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = apiSlice;
