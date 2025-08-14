import express from 'express';

const server = express().listen(80, () => console.log());

export { server };
