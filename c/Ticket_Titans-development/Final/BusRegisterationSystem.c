#include <stdio.h>

int busnum;
int totalseats = 50;
char username[20];
char password[20];
int seat101 = 50;
int seat102 = 50;
int seat103 = 50;
int seat104 = 50;
int seat105 = 50;
int cancel;
int book;
void bookticket();
void cancelticket();
void busStatus();
void submenu();
void menu();

int main()
{
    menu();
    return 0;
}

void menu()
{
    int x;
    printf("\n<----------------------| REGISTERATION MENU |-------------------------->");

    printf("\nEnter 1 to Login.");
    printf("\nEnter 0 to Exit.");

    while (1)
    {
        printf("\nEnter a task number to run : ");
        scanf("%d", &x);

        if (x == 1)
        {
            printf("\nEnter username : ");
            scanf("%s", &username);
            printf("\nEnter password : ");
            scanf("%s", &password);

            printf("\nWelcome %s.", username);
            submenu();
            break;
        }
        else if (x == 0)
        {
            printf("\nExit!");
            break;
        }
        else
        {
            printf("Please enter a valid task number.");
        }
        while(getchar() !='\n');
    }
}

void submenu()
{
    while (1)
    {
        printf("\n<--------------------------| BUS TICKET MENU |------------------------->");
        printf("\nEnter 1 to Book Ticket.");
        printf("\nEnter 2 to Cancel Ticket.");
        printf("\nEnter 3 to Check Bus Status.");
        printf("\nEnter 4 to Exit.");

        int a;
        printf("\nEnter a Task number to run :");
        scanf("%d", &a);

        if (a == 1)
        {
            bookticket();
        }
        else if (a == 2)
        {
            cancelticket();
        }
        else if (a == 3)
        {
            busStatus();
        }

        else if (a == 4)
        {
            printf("Exit!");
            menu();
            break;
        }
        else
        {
            printf("Please enter a valid task number to run.");
        }
        while(getchar() !='\n');
    }
}

void bookticket()
{
    printf("\nEnter Bus number: ");
    scanf("%d", &busnum);

    if (busnum == 101)
    {

        printf("\nBus number : 101");
        printf("\nEnter number of seats to book :");
        scanf("%d", &book);
        seat101 = seat101 - book;
        if (seat101 <= totalseats && seat101 >= 0 && book>0)
        {
            printf("\n%d Seats booked successfuly.", book);
            printf(" \nTotal seats available= %d ", seat101);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat101 = seat101 + book;
            printf("\nInvalid number of seats for booking");
        }
    }

    else if (busnum == 102)
    {

        printf("\nBus number : 102");
        printf("\nEnter number of seats to book :");
        scanf("%d", &book);
        seat102 = seat102 - book;
        if (seat102 <= totalseats && seat102 >= 0 && book>0)
        {
            printf("\n%d Seats booked successfuly.", book);
            printf(" \nTotal seats available= %d ", seat102);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat102 = seat102 + book;
            printf("\nInvalid number of seats for booking");
        }
    }

    else if (busnum == 103)
    {

        printf("\nBus number : 103");
        printf("\nEnter number of seats to book :");
        scanf("%d", &book);
        seat103 = seat103 - book;
        if (seat103 <= totalseats && seat103 >= 0 && book>0)
        {
            printf("\n%d Seats booked successfuly.", book);
            printf(" \nTotal seats available= %d ", seat103);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat103 = seat103 + book;
            printf("\nInvalid number of seats for booking");
        }
    }
    else if (busnum == 104)
    {

        printf("\nBus number : 104");
        printf("\nEnter number of seats to book :");
        scanf("%d", &book);
        seat104 = seat104 - book;
        if (seat104 <= totalseats && seat104 >= 0 && book>0)
        {
            printf("\n%d Seats booked successfuly.", book);
            printf(" \nTotal seats available= %d ", seat104);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat104 = seat104 + book;
            printf("\nInvalid number of seats for booking");
        }
    }
    else if (busnum == 105)
    {

        printf("\nBus number : 105");
        printf("\nEnter number of seats to book :");
        scanf("%d", &book);
        seat105 = seat105 - book;
        if (seat105 <= totalseats && seat105 >= 0 && book>0)
        {
            printf("\n%d Seats booked successfuly.", book);
            printf(" \nTotal seats available= %d ", seat105);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat105 = seat105 + book;
            printf("\nInvalid number of seats for booking");
        }
    }
    else
    {
        printf("\nInvalid Bus number");
    }
}

void cancelticket()
{
    printf("\nEnter Bus number: ");
    scanf("%d", &busnum);

    if (busnum == 101)
    {

        printf("\nBus number : 101");
        printf("\nEnter number of seats to cancel :");
        scanf("%d", &cancel);
        seat101 = seat101 + cancel;
        if (seat101 <= totalseats && seat101 >= 0 && cancel>0)
        {
            printf("\n%d Seats cancelled successfuly.", cancel);
            printf(" \nTotal seats available= %d ", seat101);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat101 = seat101 - cancel;
            printf("\nInvalid number of seats for cancellation");
        }
    }

    else if (busnum == 102)
    {

        printf("\nBus number : 102");
        printf("\nEnter number of seats to cancel :");
        scanf("%d", &cancel);
        seat102 = seat102 + cancel;
        if (seat102 <= totalseats && seat102 >= 0 && cancel>0)
        {
            printf("\n%d Seats cancelled successfuly.", cancel);
            printf(" \nTotal seats available= %d ", seat102);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat102 = seat102 - cancel;
            printf("\nInvalid number of seats for cancellation");
        }
    }

    else if (busnum == 103)
    {

        printf("\nBus number : 103");
        printf("\nEnter number of seats to cancel :");
        scanf("%d", &cancel);
        seat103 = seat103 + cancel;
        if (seat103 <= totalseats && seat103 >= 0 && cancel>0)
        {
            printf("\n%d Seats cancelled successfuly.", cancel);
            printf(" \nTotal seats available= %d ", seat103);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat103 = seat103 - cancel;
            printf("\nInvalid number of seats for cancellation");
        }
    }
    else if (busnum == 104)
    {

        printf("\nBus number : 104");
        printf("\nEnter number of seats to cancel :");
        scanf("%d", &cancel);
        seat104 = seat104 + cancel;
        if (seat104 <= totalseats && seat104 >= 0 && cancel>0)
        {
            printf("\n%d Seats cancelled successfuly.", cancel);
            printf(" \nTotal seats available= %d ", seat104);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat104 = seat104 - cancel;
            printf("\nInvalid number of seats for cancellation");
        }
    }
    else if (busnum == 105)
    {

        printf("\nBus number : 105");
        printf("\nEnter number of seats to cancel :");
        scanf("%d", &cancel);
        seat105 = seat105 + cancel;
        if (seat105 <= totalseats && seat105 >= 0 && cancel>0)
        {
            printf("\n%d Seats cancelled successfuly.", cancel);
            printf(" \nTotal seats available= %d ", seat105);
            printf(" \nTotal seats= %d ", totalseats);
        }
        else
        {
            seat105 = seat105 - cancel;
            printf("\nInvalid number of seats for cancellation");
        }
    }
    else
    {
        printf("\nInvalid Bus number");
    }
}

void busStatus()
{
    printf("\nEnter Bus number: ");
    scanf("%d", &busnum);

    if (busnum == 101)
    {
        printf("\nBus number :     \t\t 101");
        printf("\nFrom :           \t\t Jodhpur");
        printf("\nTo :             \t\t Jaipur");
        printf("\nTotal Seats :    \t\t %d", totalseats);
        printf("\nAvailable Seats :\t\t %d", seat101);
    }
    else if (busnum == 102)
    {
        printf("\nBus number :     \t\t 102");
        printf("\nFrom :           \t\t Jodhpur");
        printf("\nTo :             \t\t Jaisalmer");
        printf("\nTotal Seats :    \t\t %d", totalseats);
        printf("\nAvailable Seats :\t\t %d", seat102);
    }
    else if (busnum == 103)
    {
        printf("\nBus number :     \t\t 103");
        printf("\nFrom :           \t\t Jodhpur");
        printf("\nTo :             \t\t Chittorgarh");
        printf("\nTotal Seats :    \t\t %d", totalseats);
        printf("\nAvailable Seats :\t\t %d", seat103);
    }
    else if (busnum == 104)
    {
        printf("\nBus number :     \t\t 104");
        printf("\nFrom :           \t\t Jodhpur");
        printf("\nTo :             \t\t Dhaulpur");
        printf("\nTotal Seats :    \t\t %d", totalseats);
        printf("\nAvailable Seats :\t\t %d", seat104);
    }
    else if (busnum == 105)
    {
        printf("\nBus number :     \t\t 105");
        printf("\nFrom :           \t\t Jodhpur");
        printf("\nTo :             \t\t Udaipur");
        printf("\nTotal Seats :    \t\t %d", totalseats);
        printf("\nAvailable Seats :\t\t %d", seat105);
    }
    else
    {
        printf("\nInvalid Bus number");
    }
}