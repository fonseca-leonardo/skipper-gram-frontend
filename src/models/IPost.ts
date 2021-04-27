export default interface IPost {
  id: number;
  name: string;
  campaign?: {
    id: number;
    name: string;
    color: string;
  };
  message: string;
  lastUpdate: string;
}
