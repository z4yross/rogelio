
import dotenv from 'dotenv';
dotenv.config();

import debuglib from 'debug';
debuglib.enable(process.env.DEBUG || 'rg_deployment:*');

const debug = debuglib('rg_deployment:index');
const error = debuglib('rg_deployment:index:error');

import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';
import http from 'http';

const PORT = process.env.PORT || 3000;

const webhook = new Webhooks({
	secret: process.env.WEBHOOK_SECRET,
});

webhook.onAny(({ id, name, payload }) => {
	debug(`Event ${name} received with id ${id} on ANY`);
});

webhook.on('ping', ({ id, name, payload }) => {
	debug(`Ping received with id ${id}`);
});

webhook.on('push', ({ id, name, payload }) => {
	debug(`Event ${name} received with id ${id}`);
});

webhook.on('pull_request', ({ id, name, payload }) => {
	debug(`Event ${name} received with id ${id}`);
});

const middleware = createNodeMiddleware(webhook);
http.createServer(middleware).listen(PORT);

debug(`Listening on port ${PORT}`);
debug(`Webhook secret: ${process.env.WEBHOOK_SECRET}`);