import random

random.seed(9320)
n = 12
for i in range(n):
    for j in range(n):
        print(f'{round(random.random())},', end=' ')
    print('')