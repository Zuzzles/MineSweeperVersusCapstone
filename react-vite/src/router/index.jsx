import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import UserDash from '../components/UserDash';
import FriendsPage from '../components/FriendsPage/FriendsPage';
import IssuePage from '../components/IssueChallengePage';
import ChallengesPage from '../components/ChallengesPage/ChallengesPage';
import GamePage from '../components/GamePage/GamePage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <UserDash />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/friends",
        element: <FriendsPage />
      },
      {
        path: "/issue",
        element: <IssuePage />
      },
      {
        path: "/challenges",
        element: <ChallengesPage />
      },
      {
        path: "/game/:id",
        element: <GamePage />
      }
    ],
  },
]);