import { gql } from "@apollo/client";

export const Total_Users = gql`
    query TotalUsers($input : TotalUserInput){
        TotalUsers(input : $input){
           roomid
           username
        }
    }
`
export const Add_User = gql`
    mutation AddUser($input : AddUserInput){
        AddUser(input : $input){
            token
        }
    }
`

