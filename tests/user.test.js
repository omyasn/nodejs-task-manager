const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDB } = require('./fixtures/db')

beforeEach(setupDB);


test('signup new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Olga',
            email: 'a@m.ri',
            password: 'dfdf423ret'
        })
        .expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Olga',
            email: 'a@m.ri',
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('dfdf423ret');

});


test('login existing', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);
    
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);

});

test('login fail', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'lolkekrtwer'
        })
        .expect(400)

});

test('get profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('get profile fail', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('delete profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('delete profile fail', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});

test('upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});