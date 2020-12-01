/**
   * A method to fetch data
   * @param url 
   * @param data 
   */
const postData = async (url: string, method: string, data?: any) => {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export enum RequestStatus {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}
export interface MyResponse {
  status: RequestStatus;
  data: any;
}
export interface RegisterArgs {
  username: string;
  password: string;
}
export interface LoginArgs {
  username: string;
  password: string;
}
export interface MarkerArgs {
  id: string;
  name: string;
  username: string;
  lat: number;
  lng: number;
  description: string;
  type: string;
  share: boolean;
}
export class Requests {

  private ip: string;
  private port: string;


  constructor(ip: string, port: string) {
    this.ip = ip;
    this.port = port;
  }
  /**
   * Adds a marker
   * @param args 
   */
  public async addMarker(args: MarkerArgs): Promise<MyResponse> {
    return postData("https://" + this.ip + "/marker/add", "GET", args)
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: {} };
      });
  }

  /**
   * Gets the markers
   */
  public async getMarkers(username: string): Promise<MyResponse> {
    return postData("https://" + this.ip + "/marker/getAll", "GET", { username: username })
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: {} };
      });
  }
  /**
   * Gets the shared markers
   */
  public async getSharedMarkers(username: string): Promise<MyResponse> {
    return postData("https://" + this.ip + "/marker/getShared", "GET", { username: username })
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: {} };
      });
  }
  /**
   * Logs the user in
   */
  public async login(args: LoginArgs): Promise<MyResponse> {
    return postData("https://" + this.ip + "/user/login", "POST", args)
      .then(response => {
        if (response.err) {
          return { status: RequestStatus.ERROR, data: {} };
        }
        return { status: RequestStatus.SUCCESS, data: response };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: error };
      });
  }
  /**
   * Logs the user out
   */
  public async logout(): Promise<any> {
    return postData("https://" + this.ip + "/user/logout", "POST")
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: {} };
      });
  }
  /**
   * Registers a new user
   */
  public async register(args: RegisterArgs): Promise<any> {
    return postData("https://" + this.ip + "/map_config/get_stations", "POST", args)
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: {} };
      });
  }
  /**
   * Sets the IP address and port to use in requests
   * @param ip new IP address
   * @param port new port
   */
  public setIpAndPort(ip: string, port: string) {
    this.ip = ip;
    this.port = port;
  }
}



