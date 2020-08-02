import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { User } from '../user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  success: boolean = false;
  userAddress: string;

  constructor(private web3Service: Web3Service) { }

  public async createUser(userAddress: string, userName: string, password: string): Promise<any> {
    console.log("UserService.createUser(): DEBUG");
    try {
      let owner: string = this.web3Service.owner;
      this.success = true;
      this.userAddress = userAddress;
      return await this.web3Service.contract.methods.addUser(userAddress, userName, password).send({ from: owner, gas: 3000000 });
    } catch (err) {
      this.success = false;
      console.log('UserService.createUser(): failed:', err);
      alert('UserService.createUser(): failed:' + err);
      return err;
    }
  }

  public async getUserName(userAddress: string): Promise<string> {
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3Service.owner;
      this.success = true;
      return await this.web3Service.contract.methods.getUserName(userAddress).call({ from: userAddress, gas: 3000000 });
    } catch (err) {
      this.success = false;
      console.log('UserService.getUserName(): failed:', err);
      alert('UserService.UserName(): failed:' + err);
    }
  }

  public async getUser(userAddress: string): Promise<User> {
    console.log("UserService.getUser(): DEBUG");
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      let owner: string = this.web3Service.owner;
      this.success = true;
      return await this.web3Service.contract.methods.getUser(userAddress).call({ from: userAddress, gas: 3000000 });
    } catch (err) {
      this.success = false;
      console.log('UserService.getUser(): failed:', err);
      alert('UserService.User(): failed:' + err);
    }
  }
}
