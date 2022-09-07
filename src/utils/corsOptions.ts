interface IcorsOptions {
  origin: string[];
}

const corsOptions: IcorsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:4000",
    "http://localhost:4001",
    "http://localhost:4002",
    "http://localhost:5000",
    "http://localhost:5001",
    "http://localhost:5002",
    "https://adrian-armesto-front-final-project.netlify.app/",
    "https://adrian-armesto-front-final-project.netlify.app",
  ],
};

export default corsOptions;
