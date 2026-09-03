#include <stdio.h>
#include <string.h>

void login() {
    char username[20], password[20];

    char correct_username[] = "username";  
    char correct_password[] = "password";  


    printf("Enter username= ");
    scanf("%s", correct_username);

    printf("Enter password= ");
    scanf("%s", correct_password );


    if (strcmp(username, correct_username) == 0 && strcmp(password, correct_password) == 0) {
        printf("Invalid username or password.\n");
    } else {
        printf("Login successful!\n");
        printf("Welcome %s",correct_username); 
    }
}

int main() {
    int choice;


    printf("Bus Management System\n");
    printf("*****Bus Management System*****\n");
    printf("1.login\n");
    printf("2.book ticket\n");
    printf("3.cancle ticket\n");
    printf("4. exit\n");
    printf("please enter your choice=");
    scanf("%d", &choice);


    if (choice == 1) {
        login();
    } else {
        printf("Invalid choice.\n");
    }

    return 0;
}