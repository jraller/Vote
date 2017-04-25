module.exports = {
    data: function (){
        return {
            preProcessVotes: false,
            newdata: 0
        }
    },
    methods: {
        changeVotes: function() {
            this.$emit('votesChanged');
        },
        changeDelimiter: function() {
            this.$emit('delimiterChanged')
        }
    },
    created() {
        this.$on('votesChanged', function() {
            this.preProcessVotes = true;
        });
        this.$on('delimiterChanged', function() {
            this.newdata++;
        });
    }
};
