let users = {
    1: {
        id: '1',
        username: 'snasi',
        password: 'abc123',
        email: 'snasi1994@gmail.com',
        gender: 'Male',
        birthday: '06/23/1994',
    },
    2: {
        id: '1',
        username: 'notsteve',
        password: 'xyz789',
        email: 'seannj13@aol.com',
        gender: 'Unspecified',
        birthday: '06/23/1955',
    },
};
  
let boards = {
    1: {
        id: '1',
        boardname: 'Marvel',
        description: 'This is where Marvel discussions go.',
        userId: '1',
    },
    2: {
        id: '2',
        boardname: 'Pixar',
        description: 'This is where Pixar discussions go.',
        userId: '2',
    },
}

let topics = {
    1: {
        id: '1',
        boardid: '1',
        threadname: 'Shang Chi Review',
        createdate: '12/1/2021 12:03:09',
        userId: '1',
    },
    2: {
        id: '2',
        boardid: '1',
        threadname: 'Rank the Eternals',
        createdate: '12/13/2021 18:44:42',
        userId: '1',
    },
}

let posts = {
    1: {
        id: '1',
        topicid: '1',
        text: 'These are my thoughts on the movie Shang Chi.',
        userId: '1',
        postdate: '12/1/2021 12:03:09',
    },
    2: {
        id: '2',
        topicid: '1',
        text: 'I agree with your thoughts. Great Post!',
        userId: '2',
        postdate: '12/1/2021 14:30:55',
    },
};

export default {
    users,
    boards,
    topics,
    posts,
};