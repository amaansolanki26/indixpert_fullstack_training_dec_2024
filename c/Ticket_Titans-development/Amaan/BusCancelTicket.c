#include <stdio.h>

int busnum;
int totalseats = 30;
int seat = 25;

void cancelticket()
{
    int cancel;

   
        printf("\nEnter Bus number: ");
        scanf("%d", &busnum);

        if (busnum == 101)
        {
            printf("\nBus number : 101");
            printf("\nEnter number of seats to cancel :");
            scanf("%d", &cancel);
            seat = seat + cancel;
            if (seat <= totalseats)
            {
                printf("\n%d Seats cancelled successfuly.", cancel);
                printf(" \nTotal seats available= %d ", seat);
                printf(" \nTotal seats= %d ", totalseats);
            }
            else
            {
                printf("\nInvalid number of seats for cancellation");
            }
        }

        else if (busnum == 102)
        {
            printf("\nBus number : 102");
            printf("\nEnter number of seats to cancel :");
            scanf("%d", &cancel);
            seat = seat + cancel;
            if (seat <= totalseats)
            {
                printf("\n%d Seats cancelled successfuly.", cancel);
                printf(" \nTotal seats available= %d ", seat);
                printf(" \nTotal seats= %d ", totalseats);
            }
            else
            {
                printf("\nInvalid number of seats for cancellation");
            }
        }

        else if (busnum == 103)
        {
            printf("\nBus number : 103");
            printf("\nEnter number of seats to cancel :");
            scanf("%d", &cancel);
            seat = seat + cancel;
            if (seat <= totalseats)
            {
                printf("\n%d Seats cancelled successfuly.", cancel);
                printf(" \nTotal seats available= %d ", seat);
                printf(" \nTotal seats= %d ", totalseats);
            }
            else
            {
                printf("\nInvalid number of seats for cancellation");
            }
        }
        else
        {
            printf("\nInvalid Bus number");
        }
    }


int main()
{
    cancelticket();
    return 0;
}