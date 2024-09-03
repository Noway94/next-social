import { NextApiRequest, NextApiResponse } from 'next';

import { ensureAuthenticated } from '../../lib/middleware';



async function handler(req: NextApiRequest & { user: any }, res: NextApiResponse) {

  res.status(200).json({ message: 'This is a protected route', user: req.user });

}



export default ensureAuthenticated(handler);