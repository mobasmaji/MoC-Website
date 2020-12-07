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
  name: string;
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
        return { status: RequestStatus.ERROR, data: error };
      });
  }

  /**
   * Gets the markers
   */
  public async getMarkers(username: string): Promise<MyResponse> {
    return postData("https://" + this.ip + "/marker/getAll", "GET", { username: username })
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data as MarkerArgs };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: error };
      });
  }
  /**
   * Gets the shared markers
   */
  public async getSharedMarkers(): Promise<MyResponse> {
    return postData("https://" + this.ip + "/marker/getShared", "GET")
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: error };
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
   * Registers a new user
   */
  public async register(args: RegisterArgs): Promise<any> {
    return postData("https://" + this.ip + "/user/register", "POST", args)
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: error };
      });
  }
  /**
   * Deletes a marker
   */
  public async deleteMarker(id: string): Promise<MyResponse> {
    return postData("https://" + this.ip + "/marker/delete", "GET", { id: id })
      .then(response => {
        return { status: RequestStatus.SUCCESS, data: response.data as MarkerArgs };
      })
      .catch(error => {
        return { status: RequestStatus.ERROR, data: error };
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



