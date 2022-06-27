# Nested Serializers

There are a number of ways of expressing relationships with JSON. Take the concept of a music API. There are 3 models: Artist, Track and Genre.

- An artist has many tracks, a track belongs to an artist (1:M)
- A track has many genres, a genre has many tracks (M:M)

Here's a couple of ways we could represent a track in JSON:

```json
{
  "id": 1,
  "name": "Would I Lie To You",
  "released": "1992-08-04",
  "length": 221,
  "artist": 1,
  "genres": [2,3]
}
```

Here we use IDs to represent the relationships. The artist of this track is the one with the ID of one, and the genres are the ones with the IDs of 2 and 3.

This is the way that DRF's serializer work by default.

Another way we could do it is like this:

```json
{
  "id": 1,
  "name": "Would I Lie To You",
  "released": "1992-08-04",
  "length": 221,
  "artist": {
    "id": 1,
    "name": "Charles & Eddie",
    "origin": "New York, NY"
  },
  "genres": [{
    "id": 2,
    "name": "Soul"
  }, {
    "id": 3,
    "name": "R&B"
  }]
}
```

We could call this _nested_. Rather than returning the IDs of the relationships, we return the entire record as a nested object.

Here's how we could do that in DRF:

```py
class ArtistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = '__all__'
        
class Track(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = '__all__'


class PopulatedTrackSerializer(TrackSerializer):

    artist = ArtistSerializer()
    genres = GenreSerializer(many=True)
```

Here we declare the `artist` as an `ArtistSerializer` object, and the `genres` as a list of `GenreSerializer` objects. The `many=True` keyword argument indicates you expect a list of genres.


This is great, however it does raise some issues.

## Nesting in both directions

One thing that we might want to do is nest the tracks on the artist, like so:

```json
{
  "id": 1,
  "name": "Charles & Eddie",
  "origin": "New York, NY",
  "tracks": [{
    "id": 1,
    "name": "Would I Lie To You",
    "released": "1992-08-04",
    "length": 221,
    "genres": [{
      "id": 2,
      "name": "Soul"
    }, {
      "id": 3,
      "name": "R&B"
    }]
  }, {
    "id": 2,
    "name": "House Is Not a Home",
    "released": "1993-04-12",
    "length": 240,
    "genres": [{
      "id": 2,
      "name": "Soul"
    }, {
      "id": 3,
      "name": "R&B"
    }]
  }]
}
```

This is problematic because we need to use the `TrackSerializer` in the `ArtistSerializer`, but the track serializer has not been declared at that point:

```py
class ArtistSerializer(serializers.ModelSerializer):

    tracks = TrackSerializer(many=True) # THIS HAS NOT BEEN DECLARED YET!

    class Meta:
        model = Artist
        fields = ('id', 'name', 'origin', 'tracks')



class TrackSerializer(serializers.ModelSerializer):

    artist = ArtistSerializer()
    genres = GenreSerializer(many=True)

    class Meta:
        model = Genre
        fields = ('id', 'name', 'released', 'length', 'artist', 'genre')
```

Also, even if we could somehow work around this problem, we would have another problem. If the artist is displaying the tracks, and each track has an artist, which is displaying the tracks, which in turn are displaying the artist, which are displaying the tracks, we have a circular structure, which causes an infinite loop when attempting to create the JSON output.

So instead we need to make more serializers, once basic serializer which displays just IDs, and a _nested_ or _populated_ serializer for nesting purposes.

That might look something like this:

```py
class ArtistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = ('id', 'name', 'origin', 'tracks')



class TrackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ('id', 'name', 'released', 'length', 'artist', 'genre')


class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ('id', 'name',)



class PopulatedArtistSerializer(ArtistSerializer):

    tracks = TrackSerializer(many=True)



class PopulatedTrackSerializer(TrackSerializer):

    artist = ArtistSerializer()
    genres = GenreSerializer(many=True)
```

Notice how we can extend the `TrackSerializer` to reduce some repetition. We can now update the view to use the populated serializer:

```py
class TrackDetail(APIView):

    def get(self, _request, pk):
        track = Track.objects.get(pk=pk)
        serializer = PopulatedTrackSerializer(track)
        return Response(serializer.data)
```

This should output the following JSON:

```json
{
  "id": 1,
  "name": "Would I Lie To You",
  "released": "1992-08-04",
  "length": 221,
  "artist": {
    "id": 1,
    "name": "Charles & Eddie",
    "origin": "New York, NY",
    "tracks": [1,2]
  },
  "genres": [{
    "id": 2,
    "name": "Soul"
  }, {
    "id": 3,
    "name": "R&B"
  }]
}
```

## Creating records

If we use a nested serializer when _creating_ or _updating_ a record it will expect to receive data in the format that it outputs the data. So if we used a populated serializer when creating a record, it would expect to receive nested data.

This may be desirable, however, you would also need to write logic to describe _how_ the serializer should deal with that data.

Here's an example with the `PopulatedTrackSerializer` above:

```py
class PopulatedTrackSerializer(TrackSerializer):

    artist = ArtistSerializer()
    genres = GenreSerializer(many=True)


    def create(self, data):
        artist_data = data.pop('artist')
        genres_data = data.pop('genres')

        # create an artist without artist or genre data
        track = Track(**data)
        # find the existing artist or create one if not found and add to the newly created track
        track.artist = Artists.get_or_create(**artist_data)
        # find the existing genres or create them if not found
        genres = [Genre.get_or_create(**genre_data) for genre_data in genres_data]
        track.set(genres) # set the genres to the track

        return track # return the completed track


    def update(self, track, data):
        artist_data = data.pop('artist')
        genres_data = data.pop('genres')

        track.name = data.get('name', track.name)
        track.released = data.get('released', track.released)
        track.length = data.get('length', track.length)

        if artist_data:
            track.artist = Artists.get_or_create(**artist_data)

        if genres_data:
            genres = [Genre.get_or_create(**genre_data) for genre_data in genres_data]
            track.set(genres)

        return track

```

This means that data can be sent from the client to the server in the same format that it is sent from server to client.

We would now need to update the view to use this template for creating and updating:

```py
class TrackList(APIView):

    def post(self, request):
        serializer = PopulatedTrackSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save() # this will call the `create` method

            return Response(serializer.data, status=201)

        return Response(serializer.data, status=422)
```

## Further reading

- [Serializers - Django REST Framework](https://www.django-rest-framework.org/api-guide/serializers)
- [Circular dependency in serializers - Stack Overflow](https://stackoverflow.com/a/47537878/536646)
