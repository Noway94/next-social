import { NextApiRequest, NextApiResponse } from 'next';

import { parseCookies } from 'nookies';



export const ensureAuthenticated = (handler: (req: NextApiRequest & { user: any }, res: NextApiResponse) => void) => {

  return async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {

    const { user } = parseCookies({ req });



    if (!user) {

      return res.status(401).json({ message: 'Not authenticated' });

    }



    req.user = JSON.parse(user);

    return handler(req as NextApiRequest & { user: any }, res);

  };

};