class Message {
    constructor(Author,Message,Channel){
        this.Author = Author;
        this.Message = Message;
        this.Channel = Channel;
    }
};

try { module.exports = Message } catch{}