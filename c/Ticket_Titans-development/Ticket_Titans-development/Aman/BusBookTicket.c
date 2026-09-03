#include<stdio.h>

int seats[5] = {50, 50, 50, 50, 50};

void book_ticket() 
{
    int bus_number;
    int seats_number;

    while (1) 
    {
        printf("enter bus number (101 to 105) ");
        if (scanf("%d", &bus_number) == 1 && bus_number>= 101 && bus_number <= 105) {
            break;
        }
        printf("\nplease enter the correct bus number ");
        while(getchar() !='\n');
    }

    while (1)
     {
        printf("enter number of seats (1 to 50) ");
        if (scanf("%d", &seats_number) == 1 && seats_number>= 1 && seats_number <= 50) {
            break;
        }

        printf("\nplease enter the correct number of seats ");
        while(getchar() !='\n');
    }

    int index=bus_number - 101;

    if (seats[index] >=seats_number)
     {
          seats[index] -=seats_number;
          
       printf("booking successful %d seats booked on bus number %d\n",seats_number,bus_number);
    } 
    else {
        printf("not enough seats available only %d left\n",seats[index]);
    }
}

int main() 
{

    book_ticket();

    
    return 0;
}