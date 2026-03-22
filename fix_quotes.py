with open('seed_directus.js', 'rb') as f:
    data = f.read()

data = data.replace(b'\xe2\x80\x98', b"'").replace(b'\xe2\x80\x99', b"'")

with open('seed_directus.js', 'wb') as f:
    f.write(data)

print('Fixed smart quotes')
